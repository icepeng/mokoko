// @ts-nocheck
import { buildASTSchema } from 'graphql';

const schemaAST = {
  "kind": "Document",
  "definitions": [
    {
      "kind": "SchemaDefinition",
      "operationTypes": [
        {
          "kind": "OperationTypeDefinition",
          "operation": "query",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          }
        }
      ],
      "directives": []
    },
    {
      "kind": "DirectiveDefinition",
      "name": {
        "kind": "Name",
        "value": "enum"
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "value"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        }
      ],
      "repeatable": false,
      "locations": [
        {
          "kind": "Name",
          "value": "ENUM_VALUE"
        }
      ]
    },
    {
      "kind": "DirectiveDefinition",
      "name": {
        "kind": "Name",
        "value": "globalOptions"
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "sourceName"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "endpoint"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "operationHeaders"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ObjMap"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "queryStringOptions"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ObjMap"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "queryParams"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ObjMap"
            }
          },
          "directives": []
        }
      ],
      "repeatable": false,
      "locations": [
        {
          "kind": "Name",
          "value": "OBJECT"
        }
      ]
    },
    {
      "kind": "DirectiveDefinition",
      "name": {
        "kind": "Name",
        "value": "httpOperation"
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "path"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "operationSpecificHeaders"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ObjMap"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "httpMethod"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HTTPMethod"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "isBinary"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "requestBaseBody"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ObjMap"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "queryParamArgMap"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ObjMap"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "queryStringOptionsByParam"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ObjMap"
            }
          },
          "directives": []
        }
      ],
      "repeatable": false,
      "locations": [
        {
          "kind": "Name",
          "value": "FIELD_DEFINITION"
        }
      ]
    },
    {
      "kind": "ObjectTypeDefinition",
      "name": {
        "kind": "Name",
        "value": "Query"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Returns a list of guild rankings by a server."
          },
          "name": {
            "kind": "Name",
            "value": "Guilds_GetGuild"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "serverName"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "queryInput_Guilds_GetGuild_serverName"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "ListType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "GuildRanking"
              }
            }
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "httpOperation"
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "path"
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "/guilds/rankings"
                  }
                },
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "operationSpecificHeaders"
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "{\"Content-Type\":\"\",\"Accept\":\"application/json\"}"
                  }
                },
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "httpMethod"
                  },
                  "value": {
                    "kind": "EnumValue",
                    "value": "GET"
                  }
                },
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "queryParamArgMap"
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "{\"serverName\":\"serverName\"}"
                  }
                }
              ]
            }
          ]
        }
      ],
      "interfaces": [],
      "directives": [
        {
          "kind": "Directive",
          "name": {
            "kind": "Name",
            "value": "globalOptions"
          },
          "arguments": [
            {
              "kind": "Argument",
              "name": {
                "kind": "Name",
                "value": "sourceName"
              },
              "value": {
                "kind": "StringValue",
                "value": "Guilds"
              }
            },
            {
              "kind": "Argument",
              "name": {
                "kind": "Name",
                "value": "endpoint"
              },
              "value": {
                "kind": "StringValue",
                "value": "https://developer-lostark.game.onstove.com"
              }
            },
            {
              "kind": "Argument",
              "name": {
                "kind": "Name",
                "value": "operationHeaders"
              },
              "value": {
                "kind": "StringValue",
                "value": "{\"Authorization\":\"{context.headers.authorization}\"}"
              }
            }
          ]
        }
      ]
    },
    {
      "kind": "ObjectTypeDefinition",
      "name": {
        "kind": "Name",
        "value": "GuildRanking"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "Rank"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "GuildName"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "GuildMessage"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "MasterName"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "Rating"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "MemberCount"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "MaxMemberCount"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "UpdatedDate"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DateTime"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "ScalarTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar."
      },
      "name": {
        "kind": "Name",
        "value": "DateTime"
      },
      "directives": []
    },
    {
      "kind": "EnumTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The name of the server"
      },
      "name": {
        "kind": "Name",
        "value": "queryInput_Guilds_GetGuild_serverName"
      },
      "values": [
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "_47336__54168__50728_"
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "enum"
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "value"
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "\"루페온\""
                  }
                }
              ]
            }
          ]
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "_49892__47532__50504_"
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "enum"
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "value"
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "\"실리안\""
                  }
                }
              ]
            }
          ]
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "_50500__47564_"
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "enum"
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "value"
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "\"아만\""
                  }
                }
              ]
            }
          ]
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "_52852__47560__51064_"
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "enum"
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "value"
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "\"카마인\""
                  }
                }
              ]
            }
          ]
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "_52852__51228__47196__49828_"
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "enum"
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "value"
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "\"카제로스\""
                  }
                }
              ]
            }
          ]
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "_50500__48652__47120__49800__46300_"
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "enum"
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "value"
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "\"아브렐슈드\""
                  }
                }
              ]
            }
          ]
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "_52852__45800_"
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "enum"
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "value"
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "\"카단\""
                  }
                }
              ]
            }
          ]
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "_45768__45208__48652_"
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "enum"
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "value"
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "\"니나브\""
                  }
                }
              ]
            }
          ]
        }
      ],
      "directives": []
    },
    {
      "kind": "ScalarTypeDefinition",
      "name": {
        "kind": "Name",
        "value": "ObjMap"
      },
      "directives": []
    },
    {
      "kind": "EnumTypeDefinition",
      "name": {
        "kind": "Name",
        "value": "HTTPMethod"
      },
      "values": [
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "GET"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "HEAD"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "POST"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PUT"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "DELETE"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "CONNECT"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "OPTIONS"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "TRACE"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PATCH"
          },
          "directives": []
        }
      ],
      "directives": []
    }
  ]
};

export default buildASTSchema(schemaAST, {
  assumeValid: true,
  assumeValidSDL: true
});